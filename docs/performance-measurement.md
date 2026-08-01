# How the resource limits were measured

A walkthrough of the load test behind [issue #449](https://github.com/NewWave4Org/NewWave4.org-frontend-new/issues/449), written so it can be followed without prior Kubernetes or load-testing background — and re-run by anyone.

Every number here is real output from 2026-07-31, not an illustration.

---

## 1. The question

Staging ran with a **`150m` CPU / `156Mi` memory** limit. Production had never been deployed. The question was simply:

> Are these limits safe to put real traffic on?

This had already gone wrong once. In July the pods crash-looped, and the write-up blamed health-check probes hitting an expensive page under a tight CPU allocation. The probes were fixed. **The limits were never examined.**

The temptation is to answer from intuition — "156Mi looks small for Node, let's double it." That is a guess. Guesses about resource limits are expensive in both directions: too low crash-loops the app, too high wastes cluster capacity you may not have. So the goal was a number backed by evidence.

---

## 2. Concepts, briefly

If these are already familiar, skip to §3.

**Millicores (`150m`).** Kubernetes measures CPU in thousandths of a core. `1000m` = 1 full core. So `150m` = **0.15 of one CPU core** — about a seventh of a core. This is not "slow CPU"; it is a hard ceiling. When the app wants more, the kernel simply stops scheduling it for the rest of each time slice. That is _throttling_, and it shows up as latency, not as an error.

**Memory limits.** Different failure mode entirely. Exceed a memory limit and the kernel **kills the process instantly** (an "OOMKill"). There is no graceful degradation. So CPU pressure looks like slowness; memory pressure looks like a restart.

**Requests vs limits.** A _request_ is what the pod reserves — the scheduler uses it to decide which node has room. A _limit_ is the hard ceiling. They can differ: reserve a little, burst to more. Staging had them set **equal** (`150m`/`156Mi` for both), which means no burst headroom at all.

**Why this app is CPU-heavy.** It is server-side rendered. Every request for a page makes the Node process build HTML on the fly — parse, render React components, serialise. That is CPU work, and it happens per request. A static site just hands over a file; this does not.

**Why `/ua` was the target.** The homepage `/` immediately redirects to `/ua` (the default locale). Testing `/` would mostly measure the redirect. `/ua` is the full dynamic render — the expensive path, and the same one that caused the original crash-loop.

---

## 3. The first approach, and why it was abandoned

The obvious move is to load-test the live staging site at `new.newwave4.org`. It was attempted and **blocked as a denial-of-service-shaped action**, which is correct: firing hundreds of concurrent requests at a live host is indistinguishable from an attack, whoever owns it.

Worth noting it was also the _weaker_ experiment, for reasons unrelated to safety:

- It measures the whole internet path — DNS, TLS, ingress, the network — not the container. Latency would include things that have nothing to do with the CPU limit.
- Two replicas sit behind a load balancer, so load is split unpredictably.
- It cannot be pushed to failure. Finding the breaking point means breaking the environment other people are using.

So the constraint pushed toward a better method rather than away from an answer.

---

## 4. The method actually used

**Run the real production Docker image locally, constrained to exactly the same limits, and load it there.**

The key insight is that a Kubernetes CPU/memory limit and a Docker `--cpus`/`--memory` flag are _the same mechanism_ — both are Linux cgroups. A container capped at `--cpus=0.15` is throttled identically to a pod limited to `150m`. So the constraint under test is reproduced faithfully, even though the orchestrator is not.

What this gives up, stated honestly:

- No ingress, TLS, or network latency — so absolute latency is optimistic versus real users.
- One replica, not two behind a balancer.
- Host CPU differs from a cluster node, so absolute throughput is not directly transferable.

What it preserves is the thing being tested: **the ratio between two limit configurations on identical code**. That comparison is the answer, and it is unaffected by the caveats above, because both runs share them.

It also allows pushing to saturation safely, and re-running as often as needed.

---

## 5. What was run

### 5.1 Establish ground truth from the live cluster first

Before simulating anything, read reality — read-only commands throughout:

```bash
kubectl -n staging get deploy newwave4-frontend -o jsonpath='...'   # configured limits
kubectl -n staging top pod                                          # actual usage
kubectl -n staging get hpa                                          # autoscaling
kubectl top nodes                                                   # cluster headroom
```

Results:

| What                | Value                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Configured          | 2 replicas, requests **and** limits = `150m` / `156Mi`                                    |
| Actual usage (idle) | `1m` CPU, **73Mi** and **98Mi** memory                                                    |
| HPA                 | min 1, max 5, targets 80% — currently `cpu: 24%/80%`, `memory: 59%/80%`, **306 days old** |
| Nodes               | 3 × 4 CPU / ~4009Mi, memory **70–81% used**                                               |

Two things already stand out without any load test:

1. A pod using **98Mi of a 156Mi limit while idle** is at 63%. The remaining ~58Mi is all the headroom there is.
2. The HPA reports **memory at 59% of its 80% trigger** — while doing essentially nothing.

### 5.2 Build the image

```bash
docker build -t nw4-resource-test .
```

The published image was preferred, but pulling it was denied by package permissions, so it was built from the same Dockerfile the pipeline uses.

### 5.3 Experiment A — the limits running today

```bash
docker run -d --name nw4-limits \
  --memory=156m --memory-swap=156m --cpus=0.15 \
  -p 3111:3000 nw4-resource-test
```

`--memory-swap` is set equal to `--memory` deliberately: without it Docker grants swap, which would mask memory pressure that Kubernetes would not tolerate.

Startup, then idle:

```
ready after ~6s
idle: mem=46.16MiB / 156MiB (29.59%)  cpu=0.02%
```

Then load — 200 requests, 10 at a time — while sampling every 2 seconds:

```bash
ab -n 200 -c 10 -q http://127.0.0.1:3111/ua
docker stats --no-stream nw4-limits
```

```
t=2s   mem=52.26MiB (33.50%)  cpu=15.22%
t=4s   mem=75.84MiB (48.61%)  cpu=15.36%
t=6s   mem=87.10MiB (55.83%)  cpu=14.91%
t=8s   mem=88.30MiB (56.60%)  cpu=15.04%
t=10s  mem=88.86MiB (56.96%)  cpu=15.21%
t=12s  mem=89.35MiB (57.27%)  cpu=13.78%
t=14s  mem=87.32MiB (55.98%)  cpu=14.43%
t=16s  mem=88.00MiB (56.41%)  cpu=4.89%     <- load finishing
t=18s  mem=86.30MiB (55.32%)  cpu=0.05%
```

**Reading the CPU column is the crux.** `docker stats` reports CPU as a percentage of _one core_. The container is capped at `--cpus=0.15`, i.e. 15% of a core. It reports **15.22%, 15.36%, 15.04%, 15.21%** — pinned at the ceiling for the entire run. The app is not "using some CPU"; it is being held back by the limit the whole time.

Latency:

```
Concurrency Level:    10
Complete requests:    200
Failed requests:      0
Requests per second:  9.19 [#/sec]
Time per request:     1088.542 ms (mean)
  50%   905 ms
  95%  1497 ms
  99%  2103 ms
 100%  2963 ms (longest)
```

### 5.4 Experiment B — the committed chart defaults

The chart in this repo already specifies `500m`/`512Mi` limits. Identical test:

```bash
docker run -d --name nw4-default \
  --memory=512m --memory-swap=512m --cpus=0.5 \
  -p 3112:3000 nw4-resource-test
```

```
t=2s  mem=78.73MiB / 512MiB (15.38%)  cpu=52.14%
t=4s  mem=97.38MiB / 512MiB (19.02%)  cpu=50.81%
t=6s  mem=95.42MiB / 512MiB (18.64%)  cpu=0.00%   <- already finished
```

```
Requests per second:  42.29 [#/sec]
Failed requests:      0
Time per request:     236.480 ms (mean)
  50%   194 ms
  95%   384 ms
  99%   494 ms
 100%   582 ms (longest)
```

---

## 6. The comparison

|                 | `150m`/`156Mi` (live) | `500m`/`512Mi` (chart default) | Change        |
| --------------- | --------------------- | ------------------------------ | ------------- |
| Throughput      | 9.19 req/s            | **42.29 req/s**                | **4.6× more** |
| Median (p50)    | 905 ms                | **194 ms**                     | 4.7× faster   |
| p95             | 1497 ms               | 384 ms                         | 3.9× faster   |
| p99             | 2103 ms               | 494 ms                         | 4.3× faster   |
| Worst request   | 2963 ms               | 582 ms                         | 5.1× faster   |
| Failed requests | 0                     | 0                              | —             |
| Peak memory     | 89Mi (**57%** of cap) | 97Mi (**19%** of cap)          | ~unchanged    |
| CPU during load | pinned at cap         | pinned at cap                  | —             |

---

## 7. How the conclusion was reached

**Memory is not the constraint.** The working set landed at ~89Mi and ~97Mi — _essentially the same_ despite one container having 3.3× more memory available. An app starved of memory would have used whatever it was given, or died. It did neither, and nothing was OOMKilled. The live pods agree: 73Mi and 98Mi. So the honest read is **~95–100Mi under load**, and `156Mi` is not immediately fatal — it just leaves only ~36% headroom for garbage collection.

This matters because the issue's own framing assumed memory was the risk. The data says otherwise.

**CPU is the constraint.** The CPU column is pinned at the cap in _both_ runs, and throughput scales almost linearly with the cap (3.3× more CPU → 4.6× more throughput). When output tracks a resource that closely, and that resource is provably maxed out, it is the bottleneck. Nothing else in the system moved.

**One honest caveat, because it changes the recommendation.** At `500m` the container was _also_ at its ceiling (52.14%, 50.81% of a core against a 50% cap). So `500m` is not "enough CPU" in an absolute sense — 10 concurrent renders saturate that too. It simply has 3.3× more capacity, so it clears the same queue 4.6× faster. The correct conclusion is _"CPU is what to buy"_, not _"500m is sufficient"_. How much is enough depends on real concurrency, which nobody has measured yet.

**This is the same fault as the July crash-loop.** Probes were hitting an expensive SSR path under this CPU cap, and timing out. The probe path was changed to something cheap, which stopped the bleeding — but the starvation underneath is unchanged and still live.

**The HPA is mis-tuned, discovered along the way.** It scales on utilisation of _requests_, and requests are set equal to limits at `156Mi`. With a ~95–100Mi working set, memory idles near 60% — against an 80% trigger. So it adds replicas for what is just Node's normal heap rather than for load. Restoring a `256Mi` request puts that at ~39% and lets CPU, the real constraint, drive scaling.

**Cluster headroom — and a correction worth learning from.** The first pass at this read `kubectl top nodes` (70–81% memory used) and concluded the limits could not be raised much. That was wrong, and the mistake is a common one: **Kubernetes schedules on _requests_, not on actual usage.** On `newwave4org-node01` requests are only **29% memory / 49% CPU**, leaving ~`2839Mi` schedulable — the committed `100m`/`256Mi` requests fit comfortably even at the HPA's 5-replica maximum (`1280Mi`).

Both numbers are real, they just answer different questions:

| Question                         | Which number            | node01                             |
| -------------------------------- | ----------------------- | ---------------------------------- |
| Will the pod be _scheduled_?     | requests vs allocatable | 29% used → yes, lots of room       |
| Will the node run out of memory? | actual usage            | 81% used → ~800Mi of real headroom |

So the honest constraint is worst-case burst, not schedulability: five pods at the observed ~100Mi working set is ~`500Mi` and fine; five pods each _allowed_ the full `512Mi` is `2560Mi` and would exhaust the node.

**The bigger finding is not the limits at all.** The overlay sets `nodeSelector: kubernetes.io/hostname: newwave4org-node01`, pinning every replica to that one node — the most loaded of the three. There is no spreading and no high availability: losing that node takes the site down, and the HPA can only add replicas onto the box it is already crowding. For "does staging resemble production", that matters more than any CPU number.

---

## 8. What was deliberately not concluded

- **No production number is proposed.** Absolute throughput on a laptop does not transfer to a cluster node, and expected production concurrency is unknown. What transfers is the _ratio_ and the _shape_ of the bottleneck.
- **The running limits were not changed.** They come from a `VALUES_YAML` repo secret, applied over the committed chart at deploy time. Editing the chart in git changes nothing until that secret changes.
- **`replicaCount` for production is left open.** The existing `frontend-prod` runs 3 replicas of a much lighter static app (4–5Mi, 0m CPU) — not a precedent for an SSR workload.

---

## 9. What to actually change

Editing `helm/frontend-chart/values.yaml` does **not** change what runs. Confirmed with `helm -n staging get values newwave4-frontend`, which lists `resources` under `USER-SUPPLIED VALUES` — it comes from the `VALUES_YAML` repo secret, and the deploy applies that secret _after_ the committed chart, so the secret wins.

[ADR 0005](./decisions/0005-commit-helm-values-defaults-to-git.md) intended that secret to carry only the three genuinely-secret `NEXT_PUBLIC_*` values, with everything else committed and reviewable. It has drifted well past that: it now also pins resources, autoscaling, replica count and node placement — all non-secret infrastructure config that is invisible in git and cannot be diffed in a PR.

**The cleanest fix is to delete the `resources` block from `VALUES_YAML` entirely**, letting the committed defaults apply:

```yaml
# remove this from the VALUES_YAML secret:
resources:
  limits:
    cpu: 150m
    memory: 156Mi
  requests:
    cpu: 150m
    memory: 156Mi
```

which yields the committed `100m`/`256Mi` requests and `500m`/`512Mi` limits. If you would rather keep it explicit in the secret, set it to the same values instead of deleting it.

Two things worth doing in the same pass, both visible in the `helm get values` output:

- **`nodeSelector: kubernetes.io/hostname: newwave4org-node01`** pins every replica to one node. Removing it lets the scheduler spread across all three and gives the deployment actual high availability.
- **`targetMemoryUtilizationPercentage: 80`** on the HPA is measured against requests. Once requests are `256Mi`, idle utilisation drops from ~60% to ~39% and stops triggering spurious scale-ups. Scaling on CPU alone would also be defensible, since CPU is the real constraint.

After changing the secret, re-run the deploy and confirm the rollout actually lands — `helm upgrade` has no `--wait` and the workflow has no `kubectl rollout status`, so a green job does not by itself mean new pods are serving:

```bash
kubectl -n staging rollout status deploy/newwave4-frontend
kubectl -n staging top pod
curl -sS https://new.newwave4.org/api/version
```

---

## 10. Reproducing it

```bash
# 1. Ground truth from the cluster (read-only)
kubectl -n staging top pod
kubectl -n staging get hpa
kubectl top nodes

# 2. Build the same image the pipeline ships
docker build -t nw4-resource-test .

# 3. Run under the limits you want to test
docker run -d --name nw4-test \
  --memory=156m --memory-swap=156m --cpus=0.15 \
  -p 3111:3000 nw4-resource-test

# 4. Wait for readiness (cheap static route, no SSR)
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3111/robots.txt

# 5. Load the expensive path, sampling resources alongside
ab -n 200 -c 10 -q http://127.0.0.1:3111/ua
docker stats --no-stream nw4-test

# 6. Clean up
docker rm -f nw4-test
```

Change `--cpus` / `--memory` and repeat. Compare ratios, not absolutes.

**Do not point `ab` at `new.newwave4.org`** or any other live host. Test a container you are running yourself.

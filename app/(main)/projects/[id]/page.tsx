"use client";

import { useParams } from "next/navigation";

function ProjectDetails() {
  const { id } = useParams();
  return (
    <div>
      <span>{id}</span>
    </div>
  )
}

export default ProjectDetails
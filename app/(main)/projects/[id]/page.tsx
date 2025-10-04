
export async function generateStaticParams() {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }];

  return data.map((item) => {
    return {
      id: item.id.toString()
    }
  })
}

function ProjectDetails({ params }: any) {
  return (
    <div>
      <span>{params.id.toString()}</span>
    </div>
  )
}

export default ProjectDetails
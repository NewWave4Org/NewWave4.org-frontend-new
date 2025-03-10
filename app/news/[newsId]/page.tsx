const Article = () => {
  return (
    <div>фыввв</div>
  );
};

export async function generateStaticParams() {
  const newsIds = ['1', '2', '3'];

  return newsIds.map((id) => ({
    newsId: id,
  }));
}



export default Article;
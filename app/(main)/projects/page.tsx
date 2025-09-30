import Hero from "@/components/ui/Hero";
import {heroData} from "@/data/projects/hero";
import { ArticleStatusEnum, ArticleTypeEnum } from "@/utils/ArticleType";
import { ApiEndpoint } from "@/utils/http/enums/api-endpoint";
import HttpMethod from "@/utils/http/enums/http-method";
import ProjectPage from "@/components/projectPage/ProjectPage";
import { IArticleBody } from "@/utils/article-content/type/interfaces";

async function ProjectsPage() {
  const baseUrl = 'https://api.stage.newwave4.org/api/v1/' + ApiEndpoint.GET_ARTICLE_CONTENT_ALL;
  const params = {
    currentPage: '1',
    articleType: ArticleTypeEnum.PROJECT.toString(),
    articleStatus: ArticleStatusEnum.PUBLISHED
  };

  const url = new URL(baseUrl);
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url, {
      method: HttpMethod.GET,
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const projects = data.content;
    console.log('projects', projects)

    return (
      <div className="ProjectsPage">
        <Hero data={heroData} />
        {projects.length > 0 ? (
            projects.map((project: IArticleBody, index: number) => (
              <ProjectPage key={index} project={project} />
            ))
          ): (
            <div className="container mx-auto px-4 py-16">
              <div className="text-h3 text-font-primary font-ebGaramond text-center mb-5 max-w-[600px] mx-auto">
                Зараз сторінка "Наші проєкти" знаходиться на етапі розробки, але зовсім скоро ми поділимося з вами результатами!
              </div>
              <div className="text-center italic">Дякуємо за терпіння!</div>
            </div>
          )
        }
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="ProjectsPage container mx-auto px-4 py-16">
        <h1>Error loading data</h1>
      </div>
    )
  }
};

export default ProjectsPage;

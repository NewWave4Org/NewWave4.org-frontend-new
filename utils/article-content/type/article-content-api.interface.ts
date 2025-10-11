import { ArticleType } from '@/utils/ArticleType';
import { CreateNewArticleRequestDTO, CreateNewArticleResponseDTO, GetArticleByIdResponseDTO, IGetAllArticleRequestDTO, IGetAllArticleResponseDTO, UpdateArticleRequestDTO, UpdateArticleResponseDTO } from './interfaces';

interface IArticleApi {
  deleteArticle: ({ id, articleType }: { id: number; articleType: ArticleType }) => void;
  getArticleById: ({ id, articleType }: { id: number; articleType: ArticleType }) => Promise<GetArticleByIdResponseDTO>;
  getAllArticle: (params: IGetAllArticleRequestDTO) => Promise<IGetAllArticleResponseDTO>;
  createNewArticle: (data: CreateNewArticleRequestDTO) => Promise<CreateNewArticleResponseDTO>;
  publishArticle: (id: number) => Promise<UpdateArticleResponseDTO>;
  updateArticle: ({ id, data }: UpdateArticleRequestDTO) => Promise<UpdateArticleResponseDTO>;
  archivedArticle: ({ id, articleType }: { id: number; articleType: ArticleType }) => void;
}

export default IArticleApi;

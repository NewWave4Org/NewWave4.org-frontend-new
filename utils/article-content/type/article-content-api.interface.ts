import { ArticleStatus, ArticleType } from '@/utils/ArticleType';
import {
  CreateNewArticleRequestDTO,
  CreateNewArticleResponseDTO,
  GerArticleByIdResponseDTO,
  IGetAllArticleRequestDTO,
  IGetAllArticleResponseDTO,
  PublishArticleResponseDTO,
  UpdateArticleRequestDTO,
  UpdateArticleResponseDTO,
} from './interfaces';

interface IArticleApi {
  deleteArticle: ({id, articleType}:{id: number, articleType: ArticleType}) => void;
  getArticleById: ({id, articleType}:{id: number, articleType: ArticleType }) => Promise<GerArticleByIdResponseDTO>;
  getAllArticle: (params: IGetAllArticleRequestDTO) => Promise<IGetAllArticleResponseDTO>;
  createNewArticle: (data: CreateNewArticleRequestDTO) => Promise<CreateNewArticleResponseDTO>;
  publishArticle: (id: number) => Promise<PublishArticleResponseDTO>;
  updateArticle: ({ id, data }: UpdateArticleRequestDTO) => Promise<UpdateArticleResponseDTO>;
  archivedArticle: ({id, articleType}:{id: number, articleType: ArticleType}) => void;
}

export default IArticleApi;

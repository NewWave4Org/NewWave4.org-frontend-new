import ProgramPageClient from '@/components/program/ProgramPageClient';

function ProgramPage() {
  // const dispatch = useAppDispatch();
  // const router = useRouter();

  // const params = useParams();
  // const id = params.id;
  // const programId = Number(id);

  // const [program, setProgram] = useState<GetArticleByIdResponseDTO | undefined>(undefined);
  // const [dopPrograms, setDopPrograms] = useState([]);

  // useEffect(() => {
  //   async function fetchFullProgramById() {
  //     try {
  //       const result = await dispatch(
  //         getArticleById({
  //           id: programId,
  //           articleType: ArticleTypeEnum.PROGRAM,
  //         }),
  //       ).unwrap();

  //       setProgram(result);
  //     } catch (error) {
  //       console.log('error', error);
  //       toast.error('Failed to fetch project');
  //     }
  //   }

  //   fetchFullProgramById();
  // }, [programId, dispatch]);

  // useEffect(() => {
  //   async function fetchDopPrograms() {
  //     try {
  //       const result = await dispatch(
  //         getAllArticle({
  //           page: 0,
  //           size: 3,
  //           articleType: ArticleTypeEnum.PROGRAM,
  //           articleStatus: ArticleStatusEnum.PUBLISHED,
  //         }),
  //       ).unwrap();

  //       setDopPrograms(result?.content);
  //     } catch (error) {
  //       console.log('error', error);
  //       toast.error('Failed to fetch project');
  //     }
  //   }

  //   fetchDopPrograms();
  // }, [dispatch]);

  return <ProgramPageClient />;
}

export default ProgramPage;

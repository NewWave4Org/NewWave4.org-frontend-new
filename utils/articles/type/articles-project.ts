const ArticleProject = {
    CULTURAL_CENTER: 'Культурний центр "Свій до свого по своє"',
    NEW_WAVE_SCHOOL: 'Школа Українознавства "Нова хвилька"',
    ART_AND_VICTORY: 'Проєкт "Мистецтво і перемога"'
} as const;

export type ArticleProjectKey = keyof typeof ArticleProject;

export const ArticlesProjectOptions = Object.entries(ArticleProject).map(([key, label]) => ({
    value: key,
    label,
}));

export function getArticleProjectLabel(key: string): string {
    return key in ArticleProject
        ? ArticleProject[key as ArticleProjectKey]
        : "Невідомий проєкт";
}
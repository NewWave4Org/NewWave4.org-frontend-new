const ArticleProject = {
    CULTURAL_CENTER: 'Культурний центр "Свій до свого по своє"',
    NEW_WAVE_SCHOOL: 'Школа Українознавства "Нова хвилька"',
    ART_AND_VICTORY: 'Проєкт "Мистецтво і перемога"'
} as const;

export { type ArticleProject };

export const ArticlesProjectOptions = Object.entries(ArticleProject).map(([key, label]) => ({
    value: key,
    label,
}));

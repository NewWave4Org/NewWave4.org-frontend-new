const ArticleProject = {
    CULTURAL_CENTER: 'Культурний центр',
    NEW_WAVE_SCHOOL: 'Школа',
    ART_AND_VICTORY: 'Мистецтво і перемога'
} as const;

export { type ArticleProject };

export const ArticlesProjectOptions = Object.entries(ArticleProject).map(([key, label]) => ({
    value: key,
    label,
}));

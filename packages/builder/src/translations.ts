export const translations = {
  components: "Components",
};

export default function t(translation: keyof typeof translations) {
  return translations[translation];
}

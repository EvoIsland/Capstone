export const useApiUrl = () => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.apiUrl;
}

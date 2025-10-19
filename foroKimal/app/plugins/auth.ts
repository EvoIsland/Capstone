import { useAuth } from "~~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
    const { accessToken, getProfile } = useAuth();

    if (accessToken.value) {
        await getProfile();
    }
});
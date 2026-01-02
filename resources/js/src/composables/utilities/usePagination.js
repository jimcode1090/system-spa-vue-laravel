import { ref, computed } from 'vue';

/**
 * Composable para manejar la paginación de listas
 *
 * @param {Array} items - Array reactivo de elementos a paginar
 * @param {Number} itemsPerPage - Número de elementos por página (default: 10)
 * @returns {Object} Objeto con propiedades y métodos de paginación
 */
export function usePagination(items, itemsPerPage = 10) {
    const currentPage = ref(0);
    const itemsPerPageRef = ref(itemsPerPage);

    /**
     * Calcula el número total de páginas
     */
    const totalPages = computed(() => {
        const totalItems = items.value.length;
        return Math.ceil(totalItems / itemsPerPageRef.value);
    });

    /**
     * Obtiene los elementos de la página actual
     */
    const paginatedItems = computed(() => {
        const startIndex = currentPage.value * itemsPerPageRef.value;
        const endIndex = startIndex + itemsPerPageRef.value;
        return items.value.slice(startIndex, endIndex);
    });

    /**
     * Genera un array con los números de página para renderizar
     */
    const pageNumbers = computed(() => {
        return Array.from({ length: totalPages.value }, (_, index) => index);
    });

    /**
     * Verifica si existe una página anterior
     */
    const hasPreviousPage = computed(() => {
        return currentPage.value > 0;
    });

    /**
     * Verifica si existe una página siguiente
     */
    const hasNextPage = computed(() => {
        return currentPage.value < totalPages.value - 1;
    });

    /**
     * Avanza a la siguiente página
     */
    const goToNextPage = () => {
        if (hasNextPage.value) {
            currentPage.value++;
        }
    };

    /**
     * Retrocede a la página anterior
     */
    const goToPreviousPage = () => {
        if (hasPreviousPage.value) {
            currentPage.value--;
        }
    };

    /**
     * Va a una página específica
     * @param {Number} pageNumber - Número de página (0-indexed)
     */
    const goToPage = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages.value) {
            currentPage.value = pageNumber;
        }
    };

    /**
     * Reinicia la paginación a la primera página
     */
    const resetPagination = () => {
        currentPage.value = 0;
    };

    /**
     * Verifica si una página está activa
     * @param {Number} pageNumber - Número de página a verificar
     * @returns {Boolean}
     */
    const isPageActive = (pageNumber) => {
        return currentPage.value === pageNumber;
    };

    return {
        // State
        currentPage,
        itemsPerPage: itemsPerPageRef,

        // Computed
        totalPages,
        paginatedItems,
        pageNumbers,
        hasPreviousPage,
        hasNextPage,

        // Methods
        goToNextPage,
        goToPreviousPage,
        goToPage,
        resetPagination,
        isPageActive,
    };
}

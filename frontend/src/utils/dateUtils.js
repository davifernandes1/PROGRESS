export const formatDate = (dateString, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('pt-BR', options); }
    catch { return 'Data Inválida'; }
};

export const formatDateTime = (dateString) => formatDate(dateString, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

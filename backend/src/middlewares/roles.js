const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Verifica se o utilizador está autenticado e se o seu cargo está na lista permitida
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Permissão negada para o seu cargo.' });
        }
        next();
    };
};

module.exports = { authorizeRole };
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err.stack);
    } else {
        console.log('✅ Conectado ao PostgreSQL com sucesso!');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor PROGRESS a correr na porta ${PORT}`);
        });
    }
});
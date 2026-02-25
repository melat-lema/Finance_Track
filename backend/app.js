const express = require('express');
const prisma = require('./db');
const app = express();
const routes = require('./src/routes/index');

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] 
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.get('/api/db-test', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      status: 'success', 
      message: 'Database connected!', 
    
    });
    console.log('Database connection successful');
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
}
);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

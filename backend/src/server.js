require('dotenv').config();

const { PORT } = require('./config/env');
const { buildContainer } = require('./container');
const { createApp } = require('./app');

const app = createApp(buildContainer());

app.listen(PORT, () => {
  console.log(`🚀 SmartFoodPop Backend Server corriendo en http://localhost:${PORT}`);
});

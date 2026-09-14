import app from './app.ts';

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`API listening at http://${host}:${port}`);
});

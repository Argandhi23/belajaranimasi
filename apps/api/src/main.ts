import { createApplication } from './app.js';
import { configuration, loadLocalEnvironment } from './environment.js';

async function bootstrap() {
  loadLocalEnvironment();
  const app = await createApplication();
  await app.listen(configuration().port, '0.0.0.0');
}

void bootstrap();

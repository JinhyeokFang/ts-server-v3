export default function processEnv(envName: string): string {
  if (process.env[envName] === undefined) {
    throw Error(`process.env.${envName}가 undefined입니다.`);
  }
  return process.env[envName] || '';
}

export function validateReaderDestination(owner: string, runtime: string) {
  const url = new URL(runtime);
  const ownerUrl = new URL(owner);
  const localHosts = ['127.0.0.1', 'localhost'];
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    !['postgres:', 'postgresql:'].includes(ownerUrl.protocol) ||
    !localHosts.includes(url.hostname) ||
    !localHosts.includes(ownerUrl.hostname) ||
    url.pathname !== '/belajar_animasi' ||
    ownerUrl.pathname !== url.pathname ||
    (ownerUrl.port || '5432') !== (url.port || '5432') ||
    ownerUrl.search !== '' ||
    url.search !== '' ||
    decodeURIComponent(url.username) !== 'belajar_reader'
  )
    throw new Error(
      'This helper only provisions local belajar_reader in belajar_animasi',
    );
}

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const issuer = config.public.netsEnvironment === 'production'
    ? 'https://netseidbroker.dk/op'
    : 'https://pp.netseidbroker.dk/op'

  config.public.netsIssuer = issuer
})

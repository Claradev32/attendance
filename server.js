const fastify = require('fastify')()


async function noOpParser(req, payload) {

  return payload;
}

fastify
  .register(require('fastify-nextjs'))
  .after(() => {


    fastify.addContentTypeParser('text/plain', noOpParser);
    fastify.addContentTypeParser('application/json', noOpParser);

    fastify.next('/*')
    fastify.next('/api/*', { method: 'ALL' });


  })

fastify.listen(3000, err => {
  if (err) throw err
  console.log('Server listening on http://localhost:3000')
})

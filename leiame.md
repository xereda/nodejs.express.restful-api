# informacoes sobre a api:

## acessar um subdocumento:

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers // providers = subdocumento

## populate de um populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_populate=createdById

## populate multiplos

http://localhost:5000/workplaces/?_populate=createdById,updatedById,providers.provider

## filtrar por um campo do subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?email=x@x.com.br

## filtrar por um campo interno ao populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?provider.name=/carlos/i

## mostrar apenas determinados campos do subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_fields=email

## mostrar apenas determinados campos de um populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_populatedFields=name,email

## paginacao de um subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_limit=2&_pag=1

## ordenar por um campo do populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_sort=-name

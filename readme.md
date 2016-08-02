# informacoes sobre a api:

## acessar um subdocumento:

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers

## populate em campo simples

http://localhost:5000/workplaces/?_populate=createdById

## populate em campo de um subdocumento

http://localhost:5000/workplaces/?_populate=providers.provider

## multiplus populates e em varios niveis

http://localhost:5000/workplaces/?_populate=providers.provider,updatedById,providers.updatedById

## populate de um populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_populate=createdById

## populate de um subdocumento dentro de outro subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_populate=Workplace.workplaces.workplace

## populate multiplos

http://localhost:5000/workplaces/?_populate=createdById,updatedById,providers.provider

## filtrar por um campo do subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?email=x@x.com.br

## filtrar por um campo interno ao populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?provider.name=/carlos/i

## acessar diretamente um campo do documento

http://localhost:5000/providers/579a6404308a23780dcfdaad/description

## mostrar apenas determinados campos do subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_fields=email

## mostrar apenas determinados campos de um populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_populatedFields=name,email

## paginacao de um  subdocumento

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_limit=2&_pag=1

## ordenar por um campo do populate

http://localhost:5000/workplaces/5797bddb6f1bce0736bfde51/providers/?_sort=-name

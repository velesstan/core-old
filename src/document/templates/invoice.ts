export default `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Накладная</title>
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
      integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="row p-5">
            <div class="col-md-6">
              <img
                src="data:image/png;base64,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"
              />
            </div>
            <div class="col-md-6 text-right">
              <p class="font-weight-bold mb-1">{{ invoiceNumber }}</p>
              <p class="text-muted">{{ invoiceDate }}</p>
            </div>
          </div>

          <hr class="my-2" />

          <div class="row pb-5 p-5">
            <div class="col-md-6">
              <p class="font-weight-bold mb-4">Кому</p>
              <p class="mb-1">John Doe, Mrs Emma Downson</p>
              <p>Acme Inc</p>
              <p class="mb-1">Berlin, Germany</p>
              <p class="mb-1">6781 45P</p>
            </div>
            <div class="col-md-6 text-right">
              <p class="font-weight-bold mb-4">Payment Details</p>
              <p class="mb-1"><span class="text-muted">VAT: </span> 1425782</p>
              <p class="mb-1">
                <span class="text-muted">VAT ID: </span> 10253642
              </p>
              <p class="mb-1">
                <span class="text-muted">Payment Type: </span> Root
              </p>
              <p class="mb-1">
                <span class="text-muted">Name: </span> John Doe
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table">
                <thead>
                  <tr>
                    <th class="border-0 text-uppercase small font-weight-bold">
                      №
                    </th>
                    <th class="border-0 text-uppercase small font-weight-bold">
                      КОД
                    </th>
                    <th class="border-0 text-uppercase small font-weight-bold">
                      Наименование
                    </th>
                    <th class="border-0 text-uppercase small font-weight-bold">
                      Количество
                    </th>
                    <th class="border-0 text-uppercase small font-weight-bold">
                      Цена розн.
                    </th>
                    <th class="border-0 text-uppercase small font-weight-bold">
                      Всего
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {{#each items}}
                  <tr>
                    <td>{{incremented @index}}</td>
                    <td>{{product.code}}</td>
                    <td>{{product.title}}</td>
                    <td>{{quantity}} {{product.category.unit}}</td>
                    <td>{{toFixed product.price_retail}}</td>
                    <td>{{toFixed total}}</td>
                  </tr>
                  {{/each}}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      class="text-right text-uppercase font-weight-bold"
                      colspan="5"
                    >
                      Итого:
                    </th>
                    <td class="text-uppercase font-weight-bold">
                      {{toFixed subtotal}}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

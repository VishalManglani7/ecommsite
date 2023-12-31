const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  const products = await Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [{
          model: Category,
          attributes: ['id', 'category_name']
      },
      {
          model: Tag,
          attributes: ['id', 'tag_name']}]
    });
    res.json(products);
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const products = await Product.findByPk(req.params.id, {
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    include: [{
      model: Category,  
      attributes: ['id', 'category_name']},
      {
        model: Tag,
        attributes: ['id', 'tag_name']}]
  });
  res.json(products);});


// create new product
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  router.post('/', async (req, res) => {
    const { product_name, price, stock, category_id, tag_id } = req.body;
      const newProduct = await Product.create({
        product_name: product_name,
        price: price,
        stock: stock,
        category_id: category_id,
        tag_id: tag_id, //lost here? is this where tags map?
      });
      res.json(newProduct);
    });


    // {
    //   "product_name": "Example Product",
    //   "price": 29.99,
    //   "stock": 50,
    //   "category_id": 1,
    //   "tag_id": 2
    // }

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});





router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  const productData = await Product.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json(productData);
});

module.exports = router;

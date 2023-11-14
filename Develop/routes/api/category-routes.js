const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categories = await Category.findAll({
    attributes: ['id', 'category_name'],
      include: [{
          model: Product,
          as: 'products',
          attributes: ['id', 'category_name']
      }]});
    res.json(categories);
});

router.get('/:id', async (req, res) => {
    const category = await Category.findByPk(req.params.id, {
      attributes: ['id', 'category_name'],
      include: [{
        model: Product, 
        as: 'products', 
        attributes: ['id', 'category_name']}]
    });
    res.json(category);
  }
);

router.post('/', async (req, res) => {
    const { id, category_name } = req.body;
    const newCategory = await Category.create({
      id: id,
      category_name: category_name,
    });
    res.json(newCategory);
  });

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});


  // delete a category by its `id` value
  router.delete('/:id', async (req, res) => {
    try {
      const categoryData = await Category.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;

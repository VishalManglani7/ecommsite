const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const tags = await Tag.findAll({
    attributes: ['id', 'tag_name'],
      include: [{
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]});
    res.json(tags);
});

router.get('/:id', async(req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const tags = await Tag.findByPk(req.params.id, {
    attributes: ['id', 'tag_name'],
    include: [{
      model: Product,  
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}]
  });
  res.json(tags);

});

router.post('/', async (req, res) => {
  // create a new tag
  const { id, tag_name } = req.body;
  const newTag = await Tag.create({
    id: id,
    tag_name: tag_name,
  });
  res.json(newTag);
});

// {
//   "id": 10,
//   "tag_name": "Example Tag"
// }

router.put('/:id', async(req, res) => {
  // update a tag's name by its `id` value
  const { id, tag_name } = req.body;
  const existingTag = await Tag.findByPk(req.params.id);
    await existingTag.update({
      id,
      tag_name,
});
res.json(existingTag);});


router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const TagData = await Tag.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json(TagData);
});

module.exports = router;

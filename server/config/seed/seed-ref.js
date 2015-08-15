module.exports = SeedRef;

function SeedRef(model, ref){
  this.id = model.modelName;
  this.model = model;
  this.ref = ref.toUpperCase();
}

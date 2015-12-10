function P3State() {
  // X position
  this.x = 0;

  // Y position
  this.y = 0;

  // Draw size
  this.size = 56;

  // State name/label
  this.name = '';

  // Number. Estimated deaths without law enacted.
  this.estDeaths = 0;

  // Number. Estimated lives saved with law enacted.
  this.estSaved = 0;

  // Boolean. True if simulating that this state has law enacted.
  this.lawEnacted = false;

  // Boolean. True if this state can be interacted with.
  this.enabled = true;

  this.ctx = undefined;
  this.canvas = undefined;
}

P3State.prototype.draw = function() {
  // --- Can this stuff be called once for all state draw calls?
  // this.ctx.beginPath();
  // this.ctx.lineWidth = '2';
  // this.ctx.strokeStyle = 'black';
  // ---

  this.ctx.rect(this.x, this.y, this.size, this.size);
  this.ctx.stroke();

  this.ctx.font = '16px Helvetica';
  this.ctx.fillStyle = '#000000';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText(this.name, this.x + this.size / 2, this.y + this.size / 2);
}

P3State.prototype.onclick = function(event) {

}
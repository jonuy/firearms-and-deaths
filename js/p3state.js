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

  this.isVisible = false;

  this.eventListener = undefined;
}

P3State.prototype.draw = function(mouseInBounds) {
  // Box fill color if law enacted
  if (this.lawEnacted) {
    if (this.enabled) {
      this.ctx.fillStyle = '#07a1c5';
    }
    // These are the 4 states that already have the law enacted
    else {
      this.ctx.fillStyle = '#88ca41';
    }

    this.ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size-2); 
  }

  // Change color and cursor style if being hovered over
  if (mouseInBounds) {
    if (this.enabled) {
      // Change cursor style
      this.canvas.style.cursor = 'pointer';

      // Draw hover style
      if (this.lawEnacted) {
        this.ctx.fillStyle = '#63b3c5';
      }
      else {
        this.ctx.fillStyle = '#cccccc';
      }

      this.ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size-2);
    }

    // Set as the hover event
    if (this.eventListener !== undefined) {
      this.eventListener.hoverEvent = this.name;
    }
  }

  // Draw outline
  this.ctx.strokeRect(this.x, this.y, this.size, this.size);

  // Draw label
  if (this.lawEnacted) {
    this.ctx.fillStyle = '#ffffff';
  }
  else {
    this.ctx.fillStyle = '#000000';
  }
  this.ctx.fillText(this.name, this.x + this.size / 2, this.y + this.size / 2);
}

P3State.prototype.onclick = function(event) {
  if (this.enabled) {
    this.lawEnacted = !this.lawEnacted;

    if (this.eventListener !== undefined) {
      this.eventListener.clickEvent = this.name;
    }
  }
}

P3State.prototype.isInBounds = function(xPos, yPos) {
  return xPos >= this.x && xPos <= this.x + this.size &&
         yPos >= this.y && yPos <= this.y + this.size;
}
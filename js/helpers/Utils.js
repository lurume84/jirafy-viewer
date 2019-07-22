moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s',
      s:  'seconds',
      ss: '%ss',
      m:  '1 min',
      mm: '%d min',
      h:  '1 hour',
      hh: '%d hours',
      d:  '1 day',
      dd: '%d days',
      M:  '1 month',
      MM: '%d months',
      y:  '1 year',
      yy: '%d years'
    }
  });

function round(value, numDec)
{
    var dec = Math.pow(10, numDec);
    return Math.round(value * dec) / dec;
}

function setAppVersion(version)
{
    var li = $("<li/>", {class: "mdl-menu__item", onclick: "window.open('https://github.com/lurume84/jirafy-desktop', '_blank')", html: "<i class=\"fas fa-desktop\"></i>&nbsp;Desktop " + version})
    li.appendTo($("#moremenu"));
}

function base64Encode(str)
{
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}

function eyes(x, y, size, event)
{
  var canvas = document.createElement("canvas"), context = canvas.getContext("2d");
  document.body.appendChild(canvas);
  
  canvas.style.position = "absolute";
  canvas.style.left = (x - size - 5) + "px";
  canvas.style.top = (y - size  / 2 - 5) + "px";
  
  var rect = canvas.getBoundingClientRect();
  canvas.width = size * 2 + 10;
  canvas.height = size + 10;

  onMouseMove(event);
  
  document.addEventListener("mousemove", onMouseMove);

  function onMouseMove(event)
  {
    var x = event.clientX - rect.left,
        y = event.clientY - rect.top;
        
    context.clearRect(0, 0, size * 2 + 10, size + 10);
    
    drawEye(x, y, size / 2 + 5, size / 2 + 5);
    drawEye(x, y, size * 1.5 + 5, size / 2 + 5);
  }
  
  function drawEye(x, y, cx, cy)
{
    var dx = x - cx,
        dy = y - cy,
        angle = Math.atan2(dy, dx);
        
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.beginPath();
    context.arc(0, 0, size / 2, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(size * 0.4, 0, size * 0.1, 0, Math.PI * 2);
    context.fill();
    context.restore();
}
}


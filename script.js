const allInput = document.getElementById("allInput");
const allCampo = document.getElementById("allCampo");
const btnSubmit = document.getElementById("btnSubmit");
const inputsCarga = document.getElementById("inputsCarga");
const btnAgregarCarga = document.getElementById("btnAgregarCarga");
const k = 8.99 * Math.pow(10, 9);

//Funcion angle
function angle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI;
    return deg;
}

//Funcion getPositionAtCenter
function getPositionAtCenter(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2,
    };
}

//Funcion getDistanceBetweenElements
function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b);

    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

btnSubmit.addEventListener("click", () => {
    allInput.style.display = "none";
    allCampo.style.display = "flex";
    const selectElements = document.querySelectorAll("#inputsCarga select");
    const selectValues = Array.from(selectElements).map((select) => select.value);

    for (let i = 0; i < 200; i++) {
        const arrow = document.createElement("div");
        arrow.className = `arrow arrow${i}`;
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        drawArrow(canvas.getContext("2d"));
        arrow.appendChild(canvas);
        allCampo.appendChild(arrow);
    }

    generarCargas(selectValues);
    valoresCarga = selectValues;
});

let i = 0;

btnAgregarCarga.addEventListener("click", () => {
    if (i < 4) {
        i++;
        const div = document.createElement("div");
        const divNth1 = document.createElement("div");
        const divNth2 = document.createElement("div");
        divNth1.textContent = `Carga ${i}:`;
        divNth2.innerHTML = `<select>
                                <option value='1'>1</option>
                                <option value='-1'>-1</option>
                                <option value='2'>2</option>
                                <option value='-2'>-2</option>
                            </select><div>C</div>`;
        div.appendChild(divNth1);
        div.appendChild(divNth2);
        inputsCarga.appendChild(div);
    }
});

function drawArrow(context) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    const baseWidth = canvasWidth / 100;
    const baseHeight = canvasHeight / 100;

    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 3;
    context.moveTo(50 * baseWidth, 50 * baseHeight);
    context.lineTo(0, 50 * baseHeight);
    context.lineTo(10 * baseWidth, 40 * baseHeight);
    context.moveTo(10 * baseWidth, 60 * baseHeight);
    context.lineTo(0, 50 * baseHeight);
    context.stroke();
}

function generarCargas(selectValues) {
    const arrows = document.querySelectorAll(".arrow");

    selectValues.forEach((carga) => {
        const cargaDiv = document.createElement("div");
        cargaDiv.className = "carga";
        const div = document.createElement("div");
        cargaDiv.appendChild(div);
        div.textContent = carga;
        allCampo.appendChild(cargaDiv);
        valoresCarga = carga;
    });

    let dragItem = null;
    let offsetX = 0;
    let offsetY = 0;

    allCampo.addEventListener("mousedown", (e) => {
        const cargaDiv = e.target.closest(".carga");

        if (cargaDiv) {
            dragItem = cargaDiv;
            offsetX = e.clientX - cargaDiv.getBoundingClientRect().left;
            offsetY = e.clientY - cargaDiv.getBoundingClientRect().top;

            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", handleDrag);
                dragItem = null;
            });

            function handleDrag(e) {
                if (dragItem) {
                    const posX = e.clientX - offsetX;
                    const posY = e.clientY - offsetY;
                    dragItem.style.left = posX + "px";
                    dragItem.style.top = posY + "px";
                }
                const cargas = document.querySelectorAll(".carga");

                arrows.forEach((arrow) => {
                    let eRx = 0;
                    let eRy = 0;

                    cargas.forEach((carga) => {
                        let qx = getPositionAtCenter(carga).x;
                        let qy = getPositionAtCenter(carga).y;
                        let distancia = getDistanceBetweenElements(arrow, carga) / 100;
                        let e;

                        const rekt = arrow.getBoundingClientRect();
                        const anchorX = rekt.left + rekt.width / 2;
                        const anchorY = rekt.top + rekt.height / 2;
                        let angleDeg = angle(qx, qy, anchorX, anchorY);

                        let cargaValue = parseInt(carga.textContent);

                        if (cargaValue > 0) {
                            angleDeg = angleDeg + 180;
                            cargaValue = +cargaValue;
                        }

                        if (cargaValue < 0) {
                            angleDeg = angleDeg + 360;
                            cargaValue = -cargaValue;
                        }

                        e = (k * cargaValue) / Math.pow(distancia, 2);

                        let ex = e * Math.cos((angleDeg * Math.PI) / 180);
                        let ey = e * Math.sin((angleDeg * Math.PI) / 180);

                        eRx += ex;
                        eRy += ey;
                    });

                    let resultant = Math.sqrt(Math.pow(eRx, 2) + Math.pow(eRy, 2));

                    let alpha = Math.atan2(eRy, eRx) * (180 / Math.PI);
                    arrow.style.transform = `rotate(${alpha}deg)`;
                    arrow.style.filter = `contrast(40%) sepia(1) hue-rotate(${resultant/19000000}deg) saturate(1000%)`;
                    
                });
            }
        }
    });
}

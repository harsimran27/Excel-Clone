let rowNumberSection = document.querySelector(".row-number-section");
let columnTagsSection = document.querySelector(".column-tag-section");
let cellSection = document.querySelector(".cell-section");
let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");

let dataObj = {};

let lastCell;

cellSection.addEventListener("scroll", function (e) {

    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
    columnTagsSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
});

for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div")
    div.innerText = i;
    div.classList.add("row-number");
    rowNumberSection.append(div);
}

for (let i = 0; i < 26; i++) {

    let asciiCode = 65 + i;

    let reqAlphabet = String.fromCharCode(asciiCode)

    let div = document.createElement("div")
    div.innerText = reqAlphabet;
    div.classList.add("column-tag")
    columnTagsSection.append(div)

}

for (let i = 1; i <= 100; i++) {

    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let j = 0; j < 26; j++) {

        let asciiCode = 65 + j;
        let reqAlphabet = String.fromCharCode(asciiCode);
        let cellAddress = reqAlphabet + i;

        //Adding key value to dataObj
        dataObj[cellAddress] = {
            value: undefined,
            formula: undefined,
            upstream: [],
            downstream: [],
        }

        let cellDiv = document.createElement("div");

        // adding input event to get the type text to cell and save the type value for the given cell object. 
        cellDiv.addEventListener("input", function (e) {
            let currCellAddress = e.currentTarget.getAttribute("data-address");
            let currCellObj = dataObj[currCellAddress];

            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined;

            for (let k = 0; k < currCellObj.upstream.length; k++) {
                //removeDownstream(parent,child);

                removeFromDownstream(currCellObj.upstream[k], currCellAddress);
            }

            currCellObj.upstream = [];

            console.log(currCellObj);
        })

        cellDiv.classList.add("cell");
        cellDiv.setAttribute("contentEditable", true);
        cellDiv.addEventListener("click", function (e) {
            if (lastCell) {
                lastCell.classList.remove("cell-selected");
            }

            e.currentTarget.classList.add("cell-selected");
            lastCell = e.currentTarget;


            let currentCellAddress = e.currentTarget.getAttribute("data-address");
            formulaBarSelectedCellArea.innerText = currentCellAddress;

        })

        cellDiv.setAttribute("data-address", cellAddress);
        rowDiv.append(cellDiv);
    }
    cellSection.append(rowDiv);
}


// C1 = Formula(2*A1)
// A1 = parent
// C1 = child

//is function kisi ki upstream se mtlb nhi hai
//iska bs itna kaam h ki parent do and child do , aur mai parent ki downstream se child ko hta dunga
//taki unke bichka connection khtm hojai
//taki agr parent update ho to connection khtm hone ke baad child update na ho

function removeFromDownstream(parentCell, childCell) {
    //fetch parent cell downstream
    let parentDownstream = dataObj[parentCell].downstream;

    //filter karo child cell ko parent ki downstream sa 
    let filteredDownstream = [];

    for (let i = 0; i < parentDownstream.length; i++) {
        if (parentDownstream[i] != childCell) {
            filteredDownstream.push(parentDownstream[i]);
        }
    }

    //3- filtered downstream ko wapis save krwado dataObj me require cell me
    dataObj[parentCell].downstream = filteredDownstream;
}
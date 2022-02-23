class CompoundObj {

    name = "NA";
    cid = -1;
    mf = "NA";
    mw = -1;
    img = "NA";

    //constructor(name: string, cid: number, mf: string, mw: number, img: string = "") {
    //    this.name = name;
    //    this.cid = cid;
    //    this.mf = mf;
    //    this.mw = mw;
    //    this.img = (img == "") ? "NA" : img;
    //}

    setAll(name: string, cid: number, mf: string, mw: number, img: string) {
        this.name = name;
        this.cid = cid;
        this.mf = mf;
        this.mw = mw;
        this.img = img;
    }

    toJSON() {
        return JSON.stringify(
            {
                'name': this.name,
                'cid': this.cid,
                'mf': this.mf,
                'mw': this.mw,
                'img': this.img
            }
        );
    }

}

export default CompoundObj;
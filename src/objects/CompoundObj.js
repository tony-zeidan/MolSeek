class CompoundObj {

    name = "NA";
    cid = -1;
    mf = "NA";
    mw = -1;
    img = "NA";

    setAll(name, cid, mf, mw, img = "NA") {
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
                'mw': this.mw
            }
        );
    }

}

export default CompoundObj;
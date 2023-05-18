//base - Product.find()  

// bigQ - //search=smartphone&page=10&category=electronics&price[$lte]=40000

class WhereClause {
    constructor(base, bigQ){
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {

        const searchword = this.bigQ.search ? {
            productName: {
                $regex: this.bigQ.search,
                $options: 'i', //case insensitivity
            }

        }: {

        }
    this.base = this.base.find({...searchword})
    return this;
    }

    filter() {
        const copyQ = {...this.bigQ}

        delete copyQ["search"];
        delete copyQ["category"];
        delete copyQ["page"];

        //convert bigQ into a String => copyQ

        let stringOfCopyQ = JSON.stringify(copyQ);

        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte)\b/g, (m) => '$${m}');

        const jsonOfCopyQ = JSON.parse(stringOfCopyQ);

        this.base = this.base.find(jsonOfCopyQ);

        return this;
        }

    pager(resultperPage){
        let currentPage = 1;

        if(this.bigQ.page) {
            currentPage = this.bigQ.page
        }

        const skipVal = resultperPage * (currentPage - 1);

      this.base =  this.base.limit(resultperPage).skip(skipVal);
     return this;
    }
}

module.exports = WhereClause;
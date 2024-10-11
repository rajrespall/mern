class APIFeatures {
    constructor(query, queryStr) {
        this.query = query; // The mongoose query
        this.queryStr = queryStr; // The query string parameters
    }

    // Search for products by keyword
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i", // Case-insensitive search
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Filter products based on various parameters
    filter() {
        const queryCopy = { ...this.queryStr };

        // Removing fields that are not for filtering
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach((el) => delete queryCopy[el]);

        // Advanced filtering for price, ratings, etc.
        let queryStr = JSON.stringify(queryCopy);

        // Replacing operators for MongoDB
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // Paginate results
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1; // Current page number
        const skip = resPerPage * (currentPage - 1); // Skip for pagination

        this.query = this.query.limit(resPerPage).skip(skip); // Limit and skip
        return this;
    }
}

export default APIFeatures;

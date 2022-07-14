import React from "react";

const PostPagination = props => {
    const { postCount, page, setPage } = props;

    const pagination = () => {
        const totalPages = Math.ceil(postCount && postCount.totalPosts / 3);
        const pages = [];
        pages.push(
            <li key='Previous'>
                <button
                className={`page-link ${1 === page && 'page-disabled'}`} onClick={() => setPage(1)}>
                    Previous
                </button>
            </li>
        );
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i.toString()}>
                    <button
                    className={`page-link ${i === page && 'selected-page'}`} onClick={() => setPage(i)}>
                        {i}
                    </button>
                </li>
            );
        }
        pages.push(
            <li key='Next'>
                <button
                className={`page-link ${totalPages === page && 'page-disabled'}`} onClick={() => setPage(totalPages)}>
                    Next
                </button>
            </li>
        );
        return pages;
    };

    return (
        <nav>
            <ul
            className="pagination justify-content-center"
            >                
                {pagination()}
            </ul>
        </nav>
    );
};

export default PostPagination;
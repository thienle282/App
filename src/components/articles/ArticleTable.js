import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchArticles } from "../../actions";
import articleReducer from "../../reducers/articleReducer";

//GLOBAL FUNCTION. 
function searchingFor(input) {
  return function(x)
  {
    return x.article_title.toLowerCase().includes(input.searchTitle.toLowerCase())
    && x.article_author.toLowerCase().includes(input.searchAuthor.toLowerCase())
  };
  /*
    if this article's title contains the term, return true, else return false
  };*/
}

class ArticleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: articleReducer,
      searchTitle: "",
      searchAuthor: "",
      searchDateMin: "",
      searchDateMax: ""
    };
    this.searchHandler = this.searchHandler.bind(this);
  }

  searchHandler(event) {
    console.log(event.target.id)
    if(event.target.id === "title")
    {
      this.setState({ searchTitle: event.target.value });
    }
    if(event.target.id === "author")
    {
      this.setState({ searchAuthor: event.target.value });
    }
  }

  componentDidMount() {
    this.props.fetchArticles();
  }

  renderAdmin(article) {
    if (article.userId === this.props.currentUserId) {
      return (
        <div className="right floated content">
          <Link
            to={`/articles/edit/${article.id}`}
            className="ui button primary"
          >
            Edit
          </Link>

          <Link
            to={`/articles/delete/${article.id}`}
            className="ui button negative"
          >
            Delete
          </Link>
        </div>
      );
    }
  }

  renderList() {
    return (
      <div>
        <form className="ui form">
          <input
            id="title"
            type="text"
            onChange={this.searchHandler}
            placeholder="Search Title"
          />
          <input
            id="author"
            type="text"
            onChange={this.searchHandler}
            placeholder="Search Author"
          />
        </form>
        <table className="ui selectable celled table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publication Type</th>
              <th>Publication</th>
              <th>Year</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{this.renderItem()}</tbody>
        </table>
      </div>
    );
  }

  renderItem() {
    return this.props.articles.filter(searchingFor(this.state)).map((article) => {
      return (
        <tr key={article.id}>
          <td>{article.article_title}</td>
          <td>{article.article_author}</td>
          <td>{article.article_publication_type}</td>
          <td>{article.article_publication}</td>
          <td>{article.article_year}</td>
          <td>{article.article_location}</td>
          <td>{article.article_status}</td>
        </tr>
      );

      //     <div className="item" key={article.id}>
      //       <i className="large middle aligned icon camera" />
      //       <div className="content">
      //         {article.article_title}
      //         <div className="description">{article.article_author}</div>
      //       </div>
      //       {this.renderAdmin(article)}
      //     </div>
      //   );
    });
  }

  renderCreate() {
    if (this.props.isSignedIn) {
      return (
        <div style={{ textAlign: "right" }}>
          <Link to="/articles/new" className="ui button primary">
            Create article
          </Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h2>Articles</h2>
        <div className="ui celled list">{this.renderList()}</div>
        {this.renderCreate()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    articles: Object.values(state.articles),
    currentUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(
  mapStateToProps,
  { fetchArticles }
)(ArticleTable);

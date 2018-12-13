import React from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import styles from './styles.module.scss';

export default class MailChimpForm extends React.Component {
  state = {
    value: '',
    submitted: false
  };

  _handleInput = e => {
    const value = e.target.value;
    this.setState({
      value
    });
  };

  _handleSubmit = e => {
    e.preventDefault();
    addToMailchimp(this.state.value)
      .then(data => {
        this.setState({
          value: '',
          submitted: true
        });
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.border} />
        <div>
          {!this.state.submitted ? (
            <React.Fragment>
              <span className={styles.mcHeader}>
                Want to be notified when I release a new article? Subscirbe to my mailing list.
              </span>

              <form onSubmit={this._handleSubmit}>
                <div className={styles.flexForm}>
                  <label className={styles.emailLabel} htmlFor="mc-email">
                    Your email address
                  </label>
                  <input
                    onChange={this._handleInput}
                    value={this.state.value}
                    type="email"
                    name="email"
                    id="mc-email"
                    placeholder="Your email address"
                  />
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </React.Fragment>
          ) : (
            <span>You signed up!</span>
          )}
        </div>
      </React.Fragment>
    );
  }
}

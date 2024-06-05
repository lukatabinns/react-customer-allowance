import React, { Component } from 'react';
import { Oval } from 'react-loader-spinner';

export class Spinner extends Component {
  render() {
    return (
      <div className="d-flex align-items-center justify-content-center svg-mid">
          <Oval
              height={60}
              width={60}
              color="#C7C7C7"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#DEDEDE"
              strokeWidth={1}
              strokeWidthSecondary={1}

          />
      </div>
    );
  }
}

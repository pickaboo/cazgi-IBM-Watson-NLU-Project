import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    
         render() {
        const emotionsnode = this.props.emotions
        const emotionRows = Object.keys(emotionsnode).map(emotoin =>
            {
                return(
                    <>
                    <tr>
                    <td>{emotoin}</td>
                    <td>{emotionsnode[emotoin]}</td>
                    </tr>
                    </>
                )
            })
      return (  
        <div>

          <table className="table">
            <tbody>
            {emotionRows}
            </tbody>
          </table>
          </div>
          );
        }
        }
export default EmotionTable;

import {React, useState} from 'react';
import "./MiddleBar.css";
import "./Widget.css";
import { ConstraintsCheckbox } from './ConstraintsCheckbox'
import { NotesLine } from './NotesLine'

import { useSelector, useDispatch } from 'react-redux'
import { 
    selectMed, 
    updateMedName,
    updateMedUnits,
    updateMedConc,
} from '../../../Store/MedSlice/MedSlice';

const units = ['mg', 'g', 'mcg', 'mEq', 'Eq'];

function renderUnitButtons(activeUnits, dispatch) {
    return(
        <div>
            {units.map(unit => (
                <button className={unit == activeUnits ? "Active-Unit-Button" : "Inactive-Unit-Button"} onClick = {() => dispatch(updateMedUnits(unit))}>
                    {unit}
                </button>
            ))}
        </div>
    )
}

function UnitsInput(props) {
    const medData = useSelector(selectMed);
    const dispatch = useDispatch();
    return(
        <div className = "UnitsWidgetInput">
            {renderUnitButtons(medData.units, dispatch)}
        </div>
    );
}

function ConcentrationInput(props) {
    const medData = useSelector(selectMed);
    const dispatch = useDispatch();
    return(
        <div className = "ConcentrationWidgetInput">
            <input type = 'text' value = {medData.conc} onChange = {e => dispatch(updateMedConc(e.target.value))} style={{ width: "30.57vw", textAlign: 'right' } }/>
            <label> {medData.units}/kg</label>
        </div>
    );
}
const StandardCustomButton = ({onClick, status}) => {
    return (
      <button className = "StandardCustomButton" onClick={onClick}>
        {`${status ? 'STANDARD' : 'CUSTOM'}`}
      </button>
    );
  };

function Widget(props) {

  const [status, setStatus] = useState(true);
  const updateStatus = () => {
    setStatus(!status);
  }

  return(
      <div className = "Widget">
        <div className = "Widget_TopRow">
          <div className = "Widget_TopRow_Left">
            <h1 className = "Widget_Title">
              {props.header}
            </h1>
          </div>
          <div className = "Widget_TopRow_Right">
            { props.toggle ?  
            ( <StandardCustomButton onClick = {updateStatus} status = {status} /> ) : (<div/>)} 
          </div>
        </div>
        <div className = "Widget_Divider"/>
        { status ? ( <Child input = {props.input} /> ) : (props.toggle ? ( <Parent input = {props.input} /> ) : (<div/>)) }
      </div> 
  );

}

export default function MiddleBar() {
    const medData = useSelector(selectMed);
    const dispatch = useDispatch();
    console.log(medData)

    return(
        <div className = "MiddleBar">
            <div className = "MiddleBar_Title">
                <div className = 'MedicationTitleText'>
                    <input type = 'text' value={medData.name} onChange={e => dispatch(updateMedName(e.target.value))}/>
                </div>
                <div className = "FolderPath">
                    ACTIVE/MEDICATIONS
                </div>
                <div className = "Divider"></div>
            </div>
            <div className = "MiddleBar_Body">
                <Widget className = "ConcentrationWidget" header = "Units" input = {<UnitsInput/>} toggle/>
            </div>
        </div>
    );
}

function Child(props) {
    return (props.input); 
  }
  
  function Parent(props) {
    const [lines, setLines] = useState([0]);  
    return (
      <div>
        <div>
        <button className = "StandardCustomButton" onClick={() => {setLines([...lines, lines.length]); }}>ADD</button>
        </div>
        <div>
        {lines.map(m => <Child input = {props.input} pstate={{lines, setLines}}/>)}
      </div>
      </div>
    );
  }
//This library is so horrible jesus christ
const Dymo = require('dymojs'), dymo = new Dymo();

var constants = require('../constants')

function oneLine(s1){

    var labelXml = `<?xml version="1.0" encoding="utf-8"?>\
    <DieCutLabel Version="8.0" Units="twips">\
    <PaperOrientation>Landscape</PaperOrientation>\
    <Id>ReturnAddress</Id>\
    <PaperName>30330 Return Address</PaperName>\
    <DrawCommands>\
    <RoundRectangle X="0" Y="0" Width="1080" Height="2880" Rx="180" Ry="180" />\
    </DrawCommands>\
        <ObjectInfo>\
        <TextObject>\
        <Name>TEXT</Name>\
        <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
        <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>\
        <LinkedObjectName></LinkedObjectName>\
        <Rotation>Rotation0</Rotation>\
        <IsMirrored>False</IsMirrored>\
        <IsVariable>False</IsVariable>\
        <HorizontalAlignment>Center</HorizontalAlignment>\
        <VerticalAlignment>Middle</VerticalAlignment>\
        <TextFitMode>AlwaysFit</TextFitMode>\
        <UseFullFontHeight>True</UseFullFontHeight>\
        <Verticalized>False</Verticalized>\
        <StyledText>\
            <Element>\
            <String>${s1}</String>\
            <Attributes>\
                <Font Family="Arial" Size="12" \
                    Bold="False" Italic="False" Underline="False" Strikeout="False"/>\
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>\
            </Attributes>\
            </Element>\
        </StyledText>\
        </TextObject>\
        <Bounds X="332" Y="121" Width="2385" Height="825" />\
        </ObjectInfo>\
    </DieCutLabel>`;

    //Name is case sensitive
    return(dymo.print(constants.printerName, labelXml));
}

module.exports = oneLine;
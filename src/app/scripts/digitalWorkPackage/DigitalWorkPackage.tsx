import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider, Grid, Segment } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IDigitalWorkPackageState extends ITeamsBaseComponentState {
    entityId?: string;
    loading: boolean;
    machineId: GUID;
    time: Date;
    voltage: number[];
    temperature: number;
    light: number;
    sensors
}


type GUID = string & { isGuid: true};
function guid(guid: string) : GUID {
    return  guid as GUID; // maybe add validation that the parameter is an actual guid ?
}

/**
 * Properties for the NewTabTab React component
 */
export interface IDigitalWorkPackageProps {

}

/**
 * Implementation of the New content page
 */
export class DigitalWorkPackage extends TeamsBaseComponent<IDigitalWorkPackageProps, IDigitalWorkPackageState> {


    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }

    }

    public async componentDidMount() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/historical";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data = await response.json();
        this.setState({
            machineId: data.machineId,
            time: data.time, // Timestamp format: ISO 8601
            voltage: data.voltage,
            temperature: data.temperature,
            light: data.light,
            loading: false,
            sensors: data
        });
    }

    public render() {
        return (
        <Provider theme={this.state.theme}>
            {/* https://fluentsite.z22.web.core.windows.net/layout */}
            <Grid styles={{
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                msGridColumns: 'repeat(12, 1fr)',
                msGridRows: 'repeat(4, 1fr)'
            }}>
                <Segment content="1" color="red" inverted/>
                <Segment content="2" color="red" inverted/>
                <Segment content="3" color="red" inverted/>
                <Segment content="4" color="red" inverted/>
                <Segment content="5" color="red" inverted/>
                <Segment content="6" color="red" inverted/>
                <Segment content="7" color="red" inverted/>
                <Segment content="8" color="red" inverted/>
                <Segment content="9" color="red" inverted/>
                <Segment content="10" color="red" inverted/>
                <Segment content="11" color="red" inverted/>
                <Segment content="12" color="red" inverted/>
                <Segment content="13" color="red" inverted/>

            </Grid>
        </Provider>
        );
    }// end render

}
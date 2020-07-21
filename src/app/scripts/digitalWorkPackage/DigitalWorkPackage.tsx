import * as React from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IDigitalWorkPackageState extends ITeamsBaseComponentState {
    entityId?: string;
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

    public render() {
        return (<Provider theme={this.state.theme}>
            <Flex 
                fill={true} 
                column 
                gap="gap.small"
                styles={{
                    padding: ".8rem 0 .8rem .5rem"}}>
                <Flex.Item>
                    <Header content="This is the DigitalWorkPackage tab" />
                </Flex.Item>

                <Flex.Item>
                    <div>
                        <Text content={this.state.entityId} />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
        );
    }// end render

}
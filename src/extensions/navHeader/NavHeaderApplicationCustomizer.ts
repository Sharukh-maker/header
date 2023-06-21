import { Log } from "@microsoft/sp-core-library";

import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";

import * as strings from "NavHeaderApplicationCustomizerStrings";

const LOG_SOURCE: string = "NavHeaderApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface INavHeaderApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  Top: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class NavHeaderApplicationCustomizer extends BaseApplicationCustomizer<INavHeaderApplicationCustomizerProperties> {
  private _topPlaceholder: PlaceholderContent | undefined;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Wait for the placeholders to be created (or handle them being changed) and then
    // render.
    this.context.placeholderProvider.changedEvent.add(
      this,
      this._renderPlaceHolders
    );

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map((name) => PlaceholderName[name])
        .join(", ")
    );

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this.onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }

        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
            <div class="header">
              <img src="https://nhssbsnp.sharepoint.com/sites/beehive/SiteAssets/H1.png"/>
  
              <div class="header-right">
                <a href="https://nhssbsnp.sharepoint.com/sites/beehive/SitePages/Main%20Landing%20Page.aspx">Home</a>
                <a href="https://nhssbsnp.sharepoint.com/sites/beehive/SitePages/Department%20Page(Option%201).aspx">Department 1</a>
                <a href="https://nhssbsnp.sharepoint.com/sites/beehive/SitePages/Department%20Page(Option%202).aspx">Department 2</a>
                <a href="https://nhssbsnp.sharepoint.com/sites/beehive/SitePages/HR%20Page.aspx">HR Page</a>
              </div>
            </div>
            <style>
              .header {
                overflow: hidden;
                background-color: #808080;
                padding: 10px 10px;
              }
  
              img {
                padding: 5px;
                width: 250px;
              }
  
              .header a {
                float: left;
                color:  white;
                text-align: center;
                padding: 12px;
                text-decoration: none;
                font-size: 20px;
                line-height: 25px;
                border-radius: 4px;
              }
  
              .header a.logo {
                line-height: 25px;
                display: flex;
                align-items: center;
              }
              
  
              .header-right a:hover {
                background-color: #ddd;
                color: black;
              }
  
              .header a.active {
                background-color: dodgerblue;
                color: white;
              }
  
              .header-right {
                float: right;
                margin:-5px;
              }
  
              @media screen and (max-width: 500px) {
                .header a {
                  float: none;
                  display: block;
                  text-align: left;
                }
  
               
              }
            </style>
          `;
        }
      }
    }
  }
}

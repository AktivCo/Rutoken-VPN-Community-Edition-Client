#include ----------------------------
!include nsDialogs.nsh
!include LogicLib.nsh
!include "MUI2.nsh"
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!include "FileFunc.nsh"
!include x64.nsh

#define -------------------------------------
!define APP_NAME "<%= name %>"
!define APP_NAME_CANONICAL "RutokenVpnclient"
!define APP_NAME_PROCESS "rutokenvpnclient"
!define OPENVPN_NAME_PROCESS "openvpn"
!define APP_VERSION "<%= version %>"
!define APP_PUBLISHER "<%= publisher %>"
!define APP_DIR "RutokenVpnClient"

!define BITMAP_FILE C:\Users\vladimir\Documents\projects\rutokenvpnclient\assets\win\a.bmp


Name "${APP_NAME}"
Unicode true
!addplugindir .


<% if(fileAssociation){ %>
# include file association script
!include "FileAssociation.nsh"
<% } %>

# define the resulting installer's name
OutFile "<%= out %>\RvpnClientSetup.exe"
RequestExecutionLevel admin

# set the installation directory
InstallDir "$PROGRAMFILES\${APP_DIR}\"


BrandingText "${APP_NAME} ${APP_VERSION}"

XPStyle on

Var hCtl_RutokenVPN
Var hCtl_RutokenVPN_Label1
Var hCtl_RutokenVPN_Label2
Var hCtl_RutokenVPN_Bitmap1
Var hCtl_RutokenVPN_Bitmap1_hImage
Var hCtl_RutokenVPN_Font1
Var hCtl_RutokenVPN_Font2
Var hCtl_RutokenVPN_CheckBox1


!macro CheckAppRunning MODE
	    FindProcDLL::FindProc "${APP_NAME_PROCESS}.exe" $R0
		${If} $R0 == 1
		KillProcDll::KillProc  "${APP_NAME_PROCESS}.exe"
			   Sleep 2000
		${EndIf}
        FindProcDLL::FindProc "${OPENVPN_NAME_PROCESS}.exe" $R0
		${If} $R0 == 1
		KillProcDll::KillProc  "${OPENVPN_NAME_PROCESS}.exe"
			   Sleep 2000
		${EndIf}
!macroend




Function nsDialogsPageLeave
    !insertmacro CheckAppRunning "install"
FunctionEnd



Function fnc_RutokenVPN_Create
  
   ; custom font definitions
  CreateFont $hCtl_RutokenVPN_Font1 "Segoe UI" "14" "400"
  CreateFont $hCtl_RutokenVPN_Font2 "Segoe UI" "21.75" "700"
  
  ; === RutokenVPN (type: Dialog) ===
  nsDialogs::Create 1044
  Pop $hCtl_RutokenVPN
  ${If} $hCtl_RutokenVPN == error
    Abort
  ${EndIf}
  SendMessage $hCtl_RutokenVPN ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  SetCtlColors $hCtl_RutokenVPN 0x444444 0xFFFFFF


   FindProcDLL::FindProc "${APP_NAME_PROCESS}.exe" $R0

${If} $R0 == 1
    ; === Label2 (type: Label) ===
	  ${NSD_CreateLabel} 17.11u 56u 178.38u 109.54u "Рутокен VPN клиент в данный момент запущен. Чтобы закрыть Рутокен VPN клиент и продолжить установку, нажмите $\"Далее$\"."
	  Pop $hCtl_RutokenVPN_Label2
	  SendMessage $hCtl_RutokenVPN_Label2 ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
	  SetCtlColors $hCtl_RutokenVPN_Label2 0x444444 0xFFFFFF
 
 ${else}
  ; === Label1 (type: Label) ===
  ${NSD_CreateLabel} 16.46u 116.31u 160.61u 62.77u "Эта программа установит на ваш компьютер$\r$\nРутокен VPN клиент "
  Pop $hCtl_RutokenVPN_Label1
  SendMessage $hCtl_RutokenVPN_Label1 ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  SetCtlColors $hCtl_RutokenVPN_Label1 0x444444 transparent

  #  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "${APP_NAME_CANONICAL} is running. $\r$\nClick OK to close it and continue with ${MODE}." /SD IDCANCEL IDOK doStopProcess
  #    Abort
  #    doStopProcess:
  #         DetailPrint "Closing running ${APP_NAME_CANONICAL} ..."
  #         ${nsProcess::KillProcess} "${APP_NAME_CANONICAL}.exe" $R0
  #         DetailPrint "Waiting for ${APP_NAME_CANONICAL} to close."
  #         Sleep 2000
${EndIf}



  
  ; === Bitmap1 (type: Bitmap) ===
  ${NSD_CreateBitmap} 0u 0u 375.19u 184.62u ""
  Pop $hCtl_RutokenVPN_Bitmap1
  SendMessage $hCtl_RutokenVPN_Bitmap1 ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  SetCtlColors $hCtl_RutokenVPN_Bitmap1 0x444444 0xFFFFFF
  File "/oname=$PLUGINSDIR\a.bmp" `${BITMAP_FILE}`
  ${NSD_SetImage} $hCtl_RutokenVPN_Bitmap1 "$PLUGINSDIR\a.bmp" $hCtl_RutokenVPN_Bitmap1_hImage
  



       LockWindow on
    GetDlgItem $0 $HWNDPARENT 1028
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1256
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1035
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1037
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1038
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1039
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1045
    ShowWindow $0 ${SW_HIDE}

;	    GetDlgItem $0 $HWNDPARENT 2
 ;   ShowWindow $0 ${SW_HIDE}

	GetDlgItem $0 $HWNDPARENT 0x40A ; Header
	 ShowWindow $0 ${SW_HIDE}


    LockWindow off
FunctionEnd

Function fnc_RutokenVPN_Show
  Call fnc_RutokenVPN_Create
  nsDialogs::Show
FunctionEnd


Function fnc_RutokenVPN_finish
 ; custom font definitions
  CreateFont $hCtl_RutokenVPN_Font1 "Segoe UI" "14" "400"
  CreateFont $hCtl_RutokenVPN_Font2 "Segoe UI" "21.75" "700"
  
  ; === RutokenVPN (type: Dialog) ===
  nsDialogs::Create 1044
  Pop $hCtl_RutokenVPN
  ${If} $hCtl_RutokenVPN == error
    Abort
  ${EndIf}
  SendMessage $hCtl_RutokenVPN ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  SetCtlColors $hCtl_RutokenVPN 0x444444 0xFFFFFF

     
	   ; === CheckBox1 (type: Checkbox) ===
  ;${NSD_CreateCheckbox} 19.75u 156.92u 195.49u 14.77u "Запустить программу?"
  ;Pop $hCtl_RutokenVPN_CheckBox1
  ;SendMessage $hCtl_RutokenVPN_CheckBox1 ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  ;SetCtlColors $hCtl_RutokenVPN_CheckBox1 0x444444 0xFFFFFF


  ; === Label1 (type: Label) ===
  ${NSD_CreateLabel} 19.75u 129.85u 160.61u 62.77u "Установка завершена."
  Pop $hCtl_RutokenVPN_Label1
  SendMessage $hCtl_RutokenVPN_Label1 ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  SetCtlColors $hCtl_RutokenVPN_Label1 0x444444 transparent
  
  




  ; === Bitmap1 (type: Bitmap) ===
  ${NSD_CreateBitmap} 0u 0u 375.19u 184.62u ""
  Pop $hCtl_RutokenVPN_Bitmap1
  SendMessage $hCtl_RutokenVPN_Bitmap1 ${WM_SETFONT} $hCtl_RutokenVPN_Font1 0
  SetCtlColors $hCtl_RutokenVPN_Bitmap1 0x444444 0xFFFFFF
  File "/oname=$PLUGINSDIR\a.bmp" `${BITMAP_FILE}`
    ${NSD_SetImage} $hCtl_RutokenVPN_Bitmap1 "$PLUGINSDIR\a.bmp" $hCtl_RutokenVPN_Bitmap1_hImage
  




       LockWindow on
    GetDlgItem $0 $HWNDPARENT 1028
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1256
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1035
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1037
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1038
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1039
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 1045
    ShowWindow $0 ${SW_HIDE}

    GetDlgItem $0 $HWNDPARENT 3
   ShowWindow $0 ${SW_HIDE}

	GetDlgItem $0 $HWNDPARENT 0x40A ; Header
	 ShowWindow $0 ${SW_HIDE}

	 	${NSD_Check} $hCtl_RutokenVPN_CheckBox1
    LockWindow off


  nsDialogs::Show 
FunctionEnd


Function CheckStart
	${NSD_GetState} $hCtl_RutokenVPN_CheckBox1 $0
		${If} $0 == ${BST_CHECKED}
			ExecShell "" "$SMPROGRAMS\${APP_DIR}\${APP_NAME}.lnk"		
		${EndIf}
FunctionEnd

# app dialogs
Page custom fnc_RutokenVPN_Show nsDialogsPageLeave
#Page custom SEC01
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
Page custom fnc_RutokenVPN_finish CheckStart

!insertmacro MUI_LANGUAGE "Russian"
!insertmacro MUI_RESERVEFILE_LANGDLL


# default section start
Section
  SetShellVarContext all

#  !insertmacro CheckAppRunning "install"
  # delete the installed files

  ExecWait 'sc stop RutokenVpnService'
  Sleep 2000
 
  RMDir /r $INSTDIR\locales
  RMDir /r $INSTDIR\resources\app\executables
  #RMDir /r $INSTDIR\resources
  
  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r "<%= appPath %>\*"

  # specify icon to go in the output path
  File "icon.ico"

  <% if(fileAssociation){ %>
    # specify file association
    ${registerExtension} "$INSTDIR\${APP_NAME_CANONICAL}.exe" "<%= fileAssociation.extension %>" "<%= fileAssociation.fileType %>"
  <% } %>

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall ${APP_NAME_CANONICAL}.exe"
  
  
  ${If} ${RunningX64}
      ExecWait '"$INSTDIR\resources\app\executables\tapinstallx64.exe" remove tap0901'
      ExecWait '"$INSTDIR\resources\app\executables\tapinstallx64.exe" install "$INSTDIR\resources\app\executables\drivers\x64\OemVista.inf" tap0901'
  ${Else}
      ExecWait '"$INSTDIR\resources\app\executables\tapinstallx86.exe" remove tap0901'
      ExecWait '"$INSTDIR\resources\app\executables\tapinstallx86.exe" install "$INSTDIR\resources\app\executables\drivers\x86\OemVista.inf" tap0901'
  ${EndIf}     

  ExecWait '"$INSTDIR\resources\app\executables\VC_redist.x86.exe" /passive'
  
  ExecWait 'sc create RutokenVpnService binpath= "$INSTDIR\resources\app\executables\RutokenVpnService.exe" start= auto'

  ExecWait 'net start RutokenVpnService'

 
  # create shortcuts in the start menu and on the desktop
  CreateDirectory "$SMPROGRAMS\${APP_DIR}"
  CreateShortCut "$SMPROGRAMS\${APP_DIR}\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME_CANONICAL}.exe"
  CreateShortCut "$SMPROGRAMS\${APP_DIR}\Uninstall ${APP_NAME}.lnk" "$INSTDIR\Uninstall ${APP_NAME_CANONICAL}.exe"
  CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME_CANONICAL}.exe" "" "$INSTDIR\icon.ico"

  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}" \
                   "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}" \
                   "UninstallString" "$INSTDIR\Uninstall ${APP_NAME_CANONICAL}.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}" \
                   "DisplayIcon" "$INSTDIR\icon.ico"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}" \
                   "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}" \
                   "Publisher" "${APP_PUBLISHER}"

  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}" \
                   "EstimatedSize" "$0"

SectionEnd



# create a section to define what the uninstaller does
Section "Uninstall"

  !insertmacro CheckAppRunning "uninstall"
  
  SetShellVarContext current
  
  
  ${If} ${RunningX64}
      ExecWait '"$INSTDIR\resources\app\executables\tapinstallx64.exe" remove tap0901'
  ${Else}
      ExecWait '"$INSTDIR\resources\app\executables\tapinstallx86.exe" remove tap0901'
  ${EndIf}     
  # delete the installed files

  ExecWait 'sc stop RutokenVpnService'
  Sleep 2000
  ExecWait 'sc delete RutokenVpnService'

  RMDir /r $INSTDIR
  RMDir /r "$APPDATA\RutokenVpnClient"
   
  SetShellVarContext all
  
  # delete the shortcuts
  delete "$SMPROGRAMS\${APP_DIR}\${APP_NAME}.lnk"
  delete "$SMPROGRAMS\${APP_DIR}\Uninstall ${APP_NAME}.lnk"
  rmDir  "$SMPROGRAMS\${APP_DIR}"
  delete "$DESKTOP\${APP_NAME}.lnk"
  
  

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME_CANONICAL}"
SectionEnd


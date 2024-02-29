<#
Description : Script interactif de renitialisation de mot de passe et traçage d'utilisation.
Auteur : Thierry.P
Version 0.1
#>


#Récupération du nom complet et du login de l'utilisateur AD
$Prenom = Read-Host "Merci d'indiquer le prénom de l'utilisateur"
$nom = Read-Host "Merci d'indiquer le nom de l'utilisateur"
$login = Read-Host "Merci d'indiquer le login de l'utilisateur"

#Motif d'éxecution du script
$motif = Read-Host "Mercci d'indiquer le motif d'éxécution du script"

#Mot de passe par défaut
$motDePasse = "Password@2023-2024!"

#Desitination du log
$directory = "C:\Users\Porteboeuf\Documents\log.txt"

#Récupération date et heure
$varMaDate = get-date -format "yyyy MM dd HH mm ss"


Function ResetPassword {

Try {
    Set-ADAccountPassword -Identity $login -Reset (ConvertTo-SecureString -AsPlainText $motDePasse -Force)
    Set-ADUser -Identity $login -ChangePasswordAtLogon $true
}
Catch { 
    Write-Host "Le mot de passe à été changé avec succès"
    }
}
    Out-File -Append  $directory
    Add-Content -Path $directory -Value "$varMaDate | $Prenom $Nom | $login | $motif"
ResetPassword

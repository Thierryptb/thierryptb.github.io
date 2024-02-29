<#
Description : Script d'autopopulation d'utilsateurs avec ajout dans un groupe et création de dossier privés mappés sur
le lecteur :P
Auteur : Thierry.P
17/08/2023
Version 0.1
#>

#Création d'un fonction pour appeler la boucle
Function Autopopulate {
    $csvpath = "C:\Scripts\Utilisateurs.csv"
    $users = Import-Csv -Path $csvpath 
    
    foreach ($user in $users)
{

    #Mise en place de la boucle
    Write-Output "-"
    Write-Output $user.Type
    Write-Output $user.Nom
    Write-Output $user.description
 
    #Génération du login
    $initialePrenom = $user.Nom.Substring(0,1)
    $nomFamille = $user.Nom.Split(" ")[2] + $user.Nom.Split(" ")[3]
    $loginGenere = $initialePrenom+"."+$nomFamille
    $loginGenere = $loginGenere.ToLower()
    Write-Output "-"
    Write-Output $loginGenere
   
    #Récupération du Groupe utilisateur
    Write-Output $user.Description 
    
    #Mot de passe par défaut
    $userUPN = $loginGenere
    $motDePasse = "Password@2023-2024!"

    #Création dossier partagé
    $directory = "E:\Personnel utilisateurs\$logingenere$"
    
    
    #Création d'utilisateur AD

Function control {
    if (-not (Get-ADUser -Filter $loginGenere) )
    {
    Write-Host "Ce login est déjà utilisé"
    Read-Host "Merci d'enter manuellement le login"
    }
   }
   Control

    Try
    {
        New-ADUser -Name $user.Nom `
                   -SamAccountName $loginGenere `
                   -UserPrincipalName $loginGenere@axeplane.loc `
                   -AccountPassword (ConvertTo-SecureString -AsPlainText $motDePasse -Force) `
                   -ChangePasswordAtLogon $true `
                   -HomeDrive "p" `
                   -HomeDirectory "\\SRV-AD-TEST\$directory" `
                   -Enabled $true
        Write-Host "L'utilisateur $user.Nom a été créé dans l'AD"
        }
    Catch {
        Write-Host "Une erreur est apparue à la création de l'utilisateur : "$_ 
        }

    #Création des services
    Try {
        New-ADGroup -Name $user.Description `
                    -Path "OU=Groupes,DC=axeplane,dc=loc" -GroupScope Global -GroupCategory Security `
                    -Passthru -Verbose
        Write-Host "Le groupe $user.Descritpion à été créé avec succès"
        }
    Catch {
        Write-Host "Une erreur est survenue lors de la création du groupe"
        }

    #Ajout des utilisateurs aux groupes
    Try {
        Add-ADGroupMember -Identity $user.Description -Members $loginGenere
        Write-Host "L'utilisateur $user.nom à été ajouté au groupe $user.Description"
        }
    Catch {
        Write-Host "Une erreur est apparue à l'ajout de l'utilisateur $user.Nom dans le groupe $user.Description"
        }

    #Création de dossiers personnels
    Try {
        New-Item  -Path $directory -ItemType Directory
        Write-Host "Le dossier à été créé"
        }
    Catch {
        Write-Host "Une erreur est apparue lors de la création du dossier"
        }

    #Modification des accès NTFS
    Try {
        Add-NTFSAccess -Path $directory `
                       -Account $loginGenere@axeplane.loc `
                       -AccessRights Modify
        Write-Host "Les accès ont été modifiés"
        }
    Catch {
        Write-Host "Erreur lors de l'attribution d'accès au partage"
        }

    #Partage des dossiers utilisateurs
    Try {
        New-SmbShare -Name $loginGenere$ -Path $directory -ChangeAccess "$loginGenere@axeplane.loc"
        Write-Host "Le partage à été créé"
        }
    Catch {
        Write-Host "Une erreur est apparue lors du partage"
        }
        
    }
}

Autopopulate
